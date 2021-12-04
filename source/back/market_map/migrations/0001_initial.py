# Generated by Django 3.2.9 on 2021-11-17 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Market',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('address', models.TextField()),
                ('longitude', models.DecimalField(decimal_places=8, max_digits=12)),
                ('latitude', models.DecimalField(decimal_places=8, max_digits=12)),
                ('category', models.CharField(max_length=50)),
                ('score', models.DecimalField(decimal_places=8, max_digits=12, null=True)),
            ],
        ),
    ]
