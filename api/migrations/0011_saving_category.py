# Generated by Django 5.1.3 on 2024-11-22 03:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_rename_description_bill_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='saving',
            name='category',
            field=models.CharField(choices=[('SAVING', 'Saving'), ('EMERGENCY FUND', 'Emergency Fund'), ('EXTRA', 'Extra')], default='OTHER', max_length=50),
        ),
    ]
