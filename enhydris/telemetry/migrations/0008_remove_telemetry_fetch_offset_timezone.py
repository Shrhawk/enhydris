# Generated by Django 3.2.19 on 2023-08-30 18:35

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('telemetry', '0007_alter_telemetry_data_timezone'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='telemetry',
            name='fetch_offset_timezone',
        ),
    ]

