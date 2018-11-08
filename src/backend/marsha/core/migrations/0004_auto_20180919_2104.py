# Generated by Django 2.0 on 2018-09-19 21:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("core", "0003_auto_20180915_1117")]

    operations = [
        migrations.AddField(
            model_name="audiotrack",
            name="state",
            field=models.CharField(
                choices=[
                    ("pending", "pending"),
                    ("error", "error"),
                    ("ready", "ready"),
                ],
                default="pending",
                help_text="state of the upload and transcoding pipeline in AWS.",
                max_length=20,
                verbose_name="state",
            ),
        ),
        migrations.AddField(
            model_name="audiotrack",
            name="uploaded_on",
            field=models.DateTimeField(
                blank=True,
                help_text="datetime at which the active version of the video was uploaded.",
                null=True,
                verbose_name="uploaded on",
            ),
        ),
        migrations.AddField(
            model_name="signtrack",
            name="state",
            field=models.CharField(
                choices=[
                    ("pending", "pending"),
                    ("error", "error"),
                    ("ready", "ready"),
                ],
                default="pending",
                help_text="state of the upload and transcoding pipeline in AWS.",
                max_length=20,
                verbose_name="state",
            ),
        ),
        migrations.AddField(
            model_name="signtrack",
            name="uploaded_on",
            field=models.DateTimeField(
                blank=True,
                help_text="datetime at which the active version of the video was uploaded.",
                null=True,
                verbose_name="uploaded on",
            ),
        ),
        migrations.AddField(
            model_name="subtitletrack",
            name="state",
            field=models.CharField(
                choices=[
                    ("pending", "pending"),
                    ("error", "error"),
                    ("ready", "ready"),
                ],
                default="pending",
                help_text="state of the upload and transcoding pipeline in AWS.",
                max_length=20,
                verbose_name="state",
            ),
        ),
        migrations.AddField(
            model_name="subtitletrack",
            name="uploaded_on",
            field=models.DateTimeField(
                blank=True,
                help_text="datetime at which the active version of the video was uploaded.",
                null=True,
                verbose_name="uploaded on",
            ),
        ),
    ]