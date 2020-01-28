from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import kitchen.models as kmodels
import kitchen.serializers as kserializers

# Create your views here.

index = never_cache(TemplateView.as_view(template_name='index.html'))


@api_view(['GET'])
def ingredients(request):
    ingredient_list = kmodels.Ingredient.objects.all()
    serialized_ingredients = kserializers.IngredientSerializer(ingredient_list, many=True)
    context = {
        'ingredients': serialized_ingredients.data,
    }
    print(context)

    return Response(context)


@api_view(['PUT'])
def add_ingredient(request):
    data = request.data
    try:
        ingredient = kmodels.Ingredient()
        ingredient.name = data['name']
        ingredient.unit = data['unit']
        ingredient.save()
        return Response('OK', status=status.HTTP_200_OK)

    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['PUT'])
def del_ingredient(request):
    data = request.data
    try:
        ingredient = kmodels.Ingredient.objects.get(id=data['id'])
        ingredient.delete()
        return Response('OK', status=status.HTTP_200_OK)

    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['GET'])
def recipes(request):
    print(request.GET.get('recipe_id'))
    if request.method == 'POST':
        print(request.POST.get('data'))
        #recipe_list = kmodels.Recipe.objects.get(id=request.POST['recipe_id'])
    else:
        recipe_list = kmodels.Recipe.objects.all()
    serialized_recipes = kserializers.RecipeSerializer(recipe_list, many=True)
    context = {
        'recipes': serialized_recipes.data,
    }

    return Response(context)


@api_view(['PUT'])
def add_recipe(request):
    data = request.data
    try:
        recipe = kmodels.Recipe()
        recipe.name = data['name']
        recipe.rations = data['rations']
        recipe.save()
        for entry in data['items']:
            item = kmodels.RecipeIngredient()
            item.recipe = recipe
            item.item = kmodels.Ingredient.objects.get(name=entry['item'])
            item.note = entry['note']
            item.quantity = entry['quantity']
            item.save()
        return Response('OK', status=status.HTTP_200_OK)
    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['PUT'])
def del_recipe(request):
    data = request.data
    try:
        recipe = kmodels.Recipe.objects.get(id=data['id'])
        recipe.delete()
        return Response('OK', status=status.HTTP_200_OK)

    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['GET'])
def receipts(request):
    receipts_list = kmodels.Receipt.objects.all()
    serialized_receipts = kserializers.ReceiptSerializer(receipts_list, many=True)
    context = {
        'receipts': serialized_receipts.data,
    }

    return Response(context)


@api_view(['PUT'])
def add_receipt(request):
    data = request.data
    try:
        receipt = kmodels.Receipt()
        receipt.date = data['date']
        receipt.store = data['store']
        receipt.save()
        for entry in data['items']:
            item = kmodels.ReceiptItem()
            item.receipt = receipt
            item.item = kmodels.Ingredient.objects.get(name=entry['item'])
            item.note = entry['note']
            item.quantity = entry['quantity']
            item.price = entry['price']
            item.save()
        return Response('OK', status=status.HTTP_200_OK)
    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['PUT'])
def del_receipt(request):
    data = request.data
    try:
        receipt = kmodels.Receipt.objects.get(id=data['id'])
        receipt.delete()
        return Response('OK', status=status.HTTP_200_OK)

    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['GET'])
def productions(request):
    productions_list = kmodels.Production.objects.all()
    serialized_productions = kserializers.ProductionSerializer(productions_list, many=True)
    context = {
        'productions': serialized_productions.data,
    }
    return Response(context)


@api_view(['PUT'])
def add_production(request):
    data = request.data
    try:
        production = kmodels.Production()
        production.date = data['date']
        production.name = data['name']
        production.save()
        for recipe in data['batches']:
            batch = kmodels.Batch()
            batch.production = production
            batch.recipe = kmodels.Recipe.objects.get(id=recipe['recipe_id'])
            batch.rations = recipe['rations']
            batch.save()
            for ingredient in recipe['ingredients']:
                print(ingredient)
                batch_ingredient = kmodels.BatchIngredient()
                batch_ingredient.batch = batch
                batch_ingredient.item = kmodels.Ingredient.objects.get(id=int(ingredient['id']))
                batch_ingredient.quantity = float(ingredient['quantity'])
                batch_ingredient.save()

        return Response('OK', status=status.HTTP_200_OK)

    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)


@api_view(['PUT'])
def del_production(request):
    data = request.data
    try:
        production = kmodels.Production.objects.get(id=data['id'])
        production.delete()
        return Response('OK', status=status.HTTP_200_OK)

    except Exception as e:
        return Response(repr(e), status=status.HTTP_200_OK)
