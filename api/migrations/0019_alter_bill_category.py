# Generated by Django 5.1.3 on 2024-11-27 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_bill_due_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bill',
            name='category',
            field=models.CharField(choices=[('GYM', 'Gym'), ('LIFE INSURANCE', 'Life Insurance'), ('ALLOWANCE', 'Allowance'), ('BAHAY', 'Bahay'), ('APARTMENT', 'Apartment'), ('EMERGENCY FUND', 'Emergency Fund'), ('SAVINGS', 'Savings'), ('EXTRA', 'Extra')], default='OTHER', max_length=50),
        ),
    ]
