# Generated by Django 3.0.2 on 2020-02-07 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('kitchen', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='batch',
            name='rations_sold',
        ),
    ]