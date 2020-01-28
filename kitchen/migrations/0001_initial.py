# Generated by Django 3.0.2 on 2020-01-28 14:04

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rations', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('initial_amount', models.FloatField(default=0)),
                ('unit', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=datetime.date.today)),
                ('store', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('rations', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=datetime.date.today)),
                ('buyer', models.CharField(max_length=40)),
                ('note', models.TextField()),
                ('price', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='SaleItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField(default=0)),
                ('note', models.TextField()),
                ('price', models.FloatField()),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='kitchen.Batch')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kitchen.Sale')),
            ],
        ),
        migrations.AddField(
            model_name='sale',
            name='batches',
            field=models.ManyToManyField(through='kitchen.SaleItem', to='kitchen.Batch'),
        ),
        migrations.CreateModel(
            name='RecipeIngredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField(default=0)),
                ('note', models.TextField(blank=True, default='')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='kitchen.Ingredient')),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kitchen.Recipe')),
            ],
        ),
        migrations.AddField(
            model_name='recipe',
            name='items',
            field=models.ManyToManyField(through='kitchen.RecipeIngredient', to='kitchen.Ingredient'),
        ),
        migrations.CreateModel(
            name='ReceiptItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField()),
                ('price', models.FloatField()),
                ('note', models.TextField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='kitchen.Ingredient')),
                ('receipt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kitchen.Receipt')),
            ],
        ),
        migrations.AddField(
            model_name='receipt',
            name='items',
            field=models.ManyToManyField(through='kitchen.ReceiptItem', to='kitchen.Ingredient'),
        ),
        migrations.CreateModel(
            name='Production',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='', max_length=30)),
                ('date', models.DateField(default=datetime.date.today)),
                ('batches', models.ManyToManyField(through='kitchen.Batch', to='kitchen.Recipe')),
            ],
        ),
        migrations.CreateModel(
            name='BatchIngredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField()),
                ('note', models.TextField(blank=True, default='')),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kitchen.Batch')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='kitchen.Ingredient')),
            ],
        ),
        migrations.AddField(
            model_name='batch',
            name='ingredients',
            field=models.ManyToManyField(through='kitchen.BatchIngredient', to='kitchen.Ingredient'),
        ),
        migrations.AddField(
            model_name='batch',
            name='production',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='kitchen.Production'),
        ),
        migrations.AddField(
            model_name='batch',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='kitchen.Recipe'),
        ),
    ]
