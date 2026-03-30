from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'get_total_items', 'get_total_price', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [CartItemInline]

    def get_total_items(self, obj):
        return obj.get_total_items()
    get_total_items.short_description = 'Total Items'

    def get_total_price(self, obj):
        return f'${obj.get_total_price():.2f}'
    get_total_price.short_description = 'Total Price'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'quantity', 'get_item_total', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']

    def get_item_total(self, obj):
        return f'${obj.get_item_total():.2f}'
    get_item_total.short_description = 'Item Total'
