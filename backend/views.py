from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import kitchen.models as kmodels
import kitchen.serializers as kserializers
from .serializers import LoginUserSerializer, UserSerializer, CreateUserSerializer
from knox.models import AuthToken
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication

# Create your views here.

index = never_cache(TemplateView.as_view(template_name='index.html'))


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })



class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LoginAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny, ]
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


@api_view(['POST'])
def logout(request):
    request._auth.delete()
    return Response({
        'msg': 'good-bye',
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ingredients(request):
    ingredient_list = kmodels.Ingredient.objects.all()
    serialized_ingredients = kserializers.IngredientSerializer(ingredient_list, many=True)
    context = {
        'ingredients': serialized_ingredients.data,
    }

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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def receipts(request):
    receipts_list = kmodels.Receipt.objects.all()
    serialized_receipts = kserializers.ReceiptSerializer(receipts_list, many=True)
    context = {
        'receipts': serialized_receipts.data,
    }

    return Response(context)


@api_view(['PUT'])
def mod_receipt(request):
    data = request.data
    try:
        if data['inputMode'] == 'add':
                receipt = kmodels.Receipt()
                receipt.date = data['date']
                receipt.store = data['store']
                receipt.save()
                for entry in data['items']:
                    item = kmodels.ReceiptItem()
                    item.receipt = receipt
                    item.item = kmodels.Ingredient.objects.get(id=entry['itemId'])
                    item.note = entry['note']
                    item.quantity = entry['quantity']
                    item.price = entry['price']
                    item.save()
                return Response('OK', status=status.HTTP_200_OK)
        elif data['inputMode'] == 'edit':
            receipt = kmodels.Receipt.objects.get(id=data['receiptId'])
            receipt.date = data['date']
            receipt.store = data['store']
            receipt.save()
            for item in receipt.receiptitem_set.all():
                item.delete()
            for entry in data['items']:
                item = kmodels.ReceiptItem()
                item.receipt = receipt
                item.item = kmodels.Ingredient.objects.get(id=entry['itemId'])
                item.note = entry['note']
                item.quantity = entry['quantity']
                item.price = entry['price']
                item.save()
            return Response('OK', status=status.HTTP_200_OK)

        else:
            return Response('Bad request', status=status.HTTP_400_BAD_REQUEST)

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
@permission_classes([IsAuthenticated])
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
            batch.recipe = kmodels.Recipe.objects.get(id=recipe['id'])
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
def edit_production(request):
    data = request.data
    try:
        production = kmodels.Production.objects.get(id=data['production_id'])
        production.date = data['date']
        production.name = data['name']
        production.save()
        for batch in production.batch_set.all():
            batch.delete()
        for recipe in data['batches']:
            batch = kmodels.Batch()
            batch.production = production
            batch.recipe = kmodels.Recipe.objects.get(id=int(recipe['id']))
            batch.rations = recipe['rations']
            batch.save()
            for ingredient in recipe['ingredients']:
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
