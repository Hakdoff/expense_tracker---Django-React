# Generated by Django 5.1.3 on 2024-11-21 03:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_income_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='income',
            name='category',
            field=models.CharField(choices=[('SALARY', 'Salary'), ('ALLOWANCE', 'Allowance'), ('GIFT', 'Gift'), ('OTHER', 'Other')], default='OTHER', max_length=50),
        ),
    ]
