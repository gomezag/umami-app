from django.db import models
from datetime import date

# Create your models here.


class Ingredient(models.Model):
    name = models.CharField(max_length=20)
    initial_amount = models.FloatField(default=0)
    unit = models.CharField(max_length=10)

    def __str__(self):
        return self.name

    @property
    def step(self):
        if self.unit == "kg" or self.unit == "gr":
            return 0.01
        if self.unit == "ud":
            return 1

        return 1

    @property
    def stock(self):
        total = 0
        for item in self.receiptitem_set.all():
            total = total+item.quantity

        for item in self.batchingredient_set.all():
            total = total-item.quantity

        return total

    def cost_at_date(self, current_date):
        ingredients_used = self.batchingredient_set.filter(batch__production__date__lt=current_date)
        qty_used = 0
        for ingredient in ingredients_used:
            qty_used = qty_used+ingredient.quantity

        ingredients_bought = [x for x in self.receiptitem_set.filter(receipt__date__lt=current_date)]
        price_table_of_not_used = [(x.quantity, x.price) for x in ingredients_bought]
        index_to_delete = []
        for ingredient in ingredients_bought:
            if ingredient.quantity <= qty_used:
                qty_used = qty_used - ingredient.quantity
                index_to_delete.append(ingredients_bought.index(ingredient))
            else:
                last_quantity = ingredient.quantity - qty_used
                last_price = ingredient.price*(last_quantity/ingredient.quantity)
                index_to_delete.append(ingredients_bought.index(ingredient))
                price_table_of_not_used.append((last_quantity, last_price))
                break

        print(index_to_delete)
        print(price_table_of_not_used)
        for index in sorted(index_to_delete, reverse=True):
            price_table_of_not_used.pop(index)
        print(price_table_of_not_used)
        average_cost = sum([x[1]/x[0] for x in price_table_of_not_used])
        return average_cost


class Receipt(models.Model):
    date = models.DateField(default=date.today)
    store = models.CharField(max_length=20)
    items = models.ManyToManyField(Ingredient, through='ReceiptItem')

    def __str__(self):
        return self.store+': '+self.date.strftime('%Y-%m-%d')+" - "+str(self.total()) + ' Gs. '

    def total(self):
        total = 0
        for item in self.receiptitem_set.all():
            total += item.price

        return total


class ReceiptItem(models.Model):
    item = models.ForeignKey(Ingredient, blank=False, null=False, on_delete=models.PROTECT)
    receipt = models.ForeignKey(Receipt, blank=False, null=False, on_delete=models.CASCADE)
    quantity = models.FloatField(blank=False, null=False)
    price = models.FloatField(blank=False, null=False)
    note = models.TextField()

    def __str__(self):
        return str(self.receipt) + " - " + str(self.item)


class Recipe(models.Model):
    items = models.ManyToManyField(Ingredient, through='RecipeIngredient')
    name = models.CharField(max_length=30)
    rations = models.FloatField()


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    item = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    quantity = models.FloatField(blank=False, null=False, default=0)
    note = models.TextField(blank=True, default="")


class Production(models.Model):
    batches = models.ManyToManyField(Recipe, through='Batch')
    name = models.CharField(max_length=30, default="")
    date = models.DateField(default=date.today)

    @property
    def cost(self):
        total = 0
        for batch in self.batch_set.all():
            total += batch.cost
        return total


class Batch(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.PROTECT)
    production = models.ForeignKey(Production, on_delete=models.CASCADE)
    rations = models.FloatField()
    ingredients = models.ManyToManyField(Ingredient, through='BatchIngredient')

    @property
    def cost(self):
        total = 0
        for ingredient in self.batchingredient_set.all():
            print(ingredient.item)
            print(self.production.date)
            total = total + ingredient.item.cost_at_date(self.production.date)*ingredient.quantity

        return total


class BatchIngredient(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    item = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    quantity = models.FloatField()
    note = models.TextField(blank=True, default="")


class Sale(models.Model):
    date = models.DateField(default=date.today)
    buyer = models.CharField(max_length=40)
    batches = models.ManyToManyField(Batch, through='SaleItem')
    note = models.TextField()
    price = models.FloatField()


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.PROTECT)
    quantity = models.FloatField(default=0)
    note = models.TextField()
    price = models.FloatField()
