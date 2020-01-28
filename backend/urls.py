"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name="index"),
    path('api/ingredients/', views.ingredients),
    path('api/add-ingredient/', views.add_ingredient),
    path('api/add-receipt/', views.add_receipt),
    path('api/add-recipe/', views.add_recipe),
    path('api/recipes/', views.recipes),
    path('api/del-recipe/', views.del_recipe),
    path('api/del-ingredient/', views.del_ingredient),
    path('api/receipts', views.receipts),
    path('api/del-receipt/', views.del_receipt),
    path('api/production/', views.productions),
    path('api/add-production/', views.add_production),
    path('api/del-production/', views.del_production),

]