from django.contrib import admin

# Register your models here.

from .models import AIConversation,AIMessage
admin.site.register(AIConversation)
admin.site.register(AIMessage)
