# Generated by Django 5.1.3 on 2024-11-27 03:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_wishlist_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wishlist',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='wishlist_images'),
        ),
    ]
