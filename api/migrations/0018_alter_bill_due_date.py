# Generated by Django 5.1.3 on 2024-11-27 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_bill_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bill',
            name='due_date',
            field=models.CharField(default='OTHER', max_length=100),
        ),
    ]
