from rest_framework import serializers
from .models import *

class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ['id', 'name', 'unit', 'step', 'stock']
        model = Ingredient


class ReceiptItemSerializer(serializers.ModelSerializer):
    item = IngredientSerializer()

    class Meta:
        fields = '__all__'
        model = ReceiptItem


class ReceiptSerializer(serializers.ModelSerializer):
    items = ReceiptItemSerializer(source='receiptitem_set', many=True, read_only=True)

    class Meta:
        fields = (
            'total',
            'id',
            'items',
            'date',
            'store',
        )
        model = Receipt


class RecipeIngredientSerializer(serializers.ModelSerializer):
    item = IngredientSerializer()

    class Meta:
        fields = (
            'item',
            'quantity',
            'note',
        )
        model = RecipeIngredient


class RecipeSerializer(serializers.ModelSerializer):
    items = RecipeIngredientSerializer(source='recipeingredient_set', many=True, read_only=True)

    class Meta:
        fields = (
            'id',
            'items',
            'name',
            'rations',
        )
        model = Recipe


class BatchIngredientSerializer(serializers.ModelSerializer):
    item = IngredientSerializer()

    class Meta:
        fields = (
            'id',
            'item',
            'quantity',
            'note',
        )
        model = BatchIngredient


class BatchSerializer(serializers.ModelSerializer):
    ingredients = BatchIngredientSerializer(source='batchingredient_set', many=True, read_only=True)
    recipe = RecipeSerializer()

    class Meta:
        fields = (
            'id',
            'rations',
            'recipe',
            'ingredients',
        )
        model = Batch


class ProductionSerializer(serializers.ModelSerializer):
    batches = BatchSerializer(source='batch_set', many=True, read_only=True)

    class Meta:
        fields = (
            'id',
            'name',
            'batches',
            'date',
            'cost',
        )
        model = Production
