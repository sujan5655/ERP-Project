
import os
import json
from decimal import Decimal

from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from groq import Groq

from sales.models import SalesOrderItem
from inventory.models import Inventory


client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_total_sales():
    total = (
        SalesOrderItem.objects
        .filter(sales_order__status="CONFIRMED")
        .aggregate(
            total=Sum(
                ExpressionWrapper(
                    F("quantity") * F("unit_price"),
                    output_field=DecimalField(
                        max_digits=15,
                        decimal_places=2
                    )
                )
            )
        )["total"]
    )

    return total or Decimal("0.00")


def get_top_selling_products():
    products = (
        SalesOrderItem.objects
        .filter(sales_order__status="CONFIRMED")
        .values(
            "product__name",
            "product__sku"
        )
        .annotate(
            total_quantity=Sum("quantity")
        )
        .order_by("-total_quantity")[:10]
    )

    return list(products)


def get_low_stock_products():
    inventory = (
        Inventory.objects
        .select_related("product", "warehouse")
        .filter(
            quantity__lte=F("reorder_level")
        )
        .values(
            "product__name",
            "product__sku",
            "warehouse__name",
            "quantity",
            "reorder_level"
        )
        .order_by("quantity")
    )

    return list(inventory)


def get_sales_summary():
    confirmed_orders = SalesOrderItem.objects.filter(
        sales_order__status="CONFIRMED"
    )

    total_sales = confirmed_orders.aggregate(
        total=Sum(
            ExpressionWrapper(
                F("quantity") * F("unit_price"),
                output_field=DecimalField(
                    max_digits=15,
                    decimal_places=2
                )
            )
        )
    )["total"] or Decimal("0.00")

    total_units = confirmed_orders.aggregate(
        total=Sum("quantity")
    )["total"] or Decimal("0.00")

    total_orders = confirmed_orders.values(
        "sales_order"
    ).distinct().count()

    average_order_value = (
        total_sales / total_orders
        if total_orders > 0
        else Decimal("0.00")
    )

    return {
        "total_sales": total_sales,
        "total_orders": total_orders,
        "total_units_sold": total_units,
        "average_order_value": average_order_value,
    }


def get_branch_sales():
    branch_sales = (
        SalesOrderItem.objects
        .filter(sales_order__status="CONFIRMED")
        .values(
            "sales_order__warehouse__branch__name"
        )
        .annotate(
            total_sales=Sum(
                ExpressionWrapper(
                    F("quantity") * F("unit_price"),
                    output_field=DecimalField(
                        max_digits=15,
                        decimal_places=2
                    )
                )
            )
        )
        .order_by("-total_sales")
    )

    return list(branch_sales)




def get_sales_summary():
    confirmed_orders = SalesOrderItem.objects.filter(
        sales_order__status="CONFIRMED"
    )

    total_sales = confirmed_orders.aggregate(
        total=Sum(
            ExpressionWrapper(
                F("quantity") * F("unit_price"),
                output_field=DecimalField(
                    max_digits=15,
                    decimal_places=2
                )
            )
        )
    )["total"] or Decimal("0.00")

    total_units = confirmed_orders.aggregate(
        total=Sum("quantity")
    )["total"] or Decimal("0.00")

    total_orders = confirmed_orders.values(
        "sales_order"
    ).distinct().count()

    average_order_value = (
        total_sales / total_orders
        if total_orders > 0
        else Decimal("0.00")
    )

    return {
    "total_sales": str(total_sales),
    "total_orders": total_orders,
    "total_units_sold": str(total_units),
    "average_order_value": str(average_order_value),
}

def get_business_insights():
    return {
        "sales_summary": get_sales_summary(),
        "branch_sales": get_branch_sales(),
        "top_selling_products": get_top_selling_products(),
        "low_stock_products": get_low_stock_products(),
        "inventory_recommendations": get_inventory_recommendations(),
    }

def get_inventory_recommendations():
    inventory = Inventory.objects.select_related(
        "product",
        "warehouse"
    ).filter(
        quantity__lte=F("reorder_level")
    ).values(
        "product__name",
        "product__sku",
        "warehouse__name",
        "quantity",
        "reorder_level",
    ).order_by("quantity")

    recommendations = []

    for item in inventory:
        quantity = item["quantity"]
        reorder_level = item["reorder_level"]

        if quantity == 0:
            priority = "HIGH"
            recommendation = "Urgently reorder this product."
        elif quantity <= reorder_level / 2:
            priority = "HIGH"
            recommendation = "Reorder this product soon."
        else:
            priority = "MEDIUM"
            recommendation = "Consider reordering this product."

        recommendations.append({
            "product": item["product__name"],
            "sku": item["product__sku"],
            "warehouse": item["warehouse__name"],
            "current_stock": str(quantity),
            "reorder_level": reorder_level,
            "priority": priority,
            "recommendation": recommendation,
        })

    return recommendations

def ask_ai(question, history=None):

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_total_sales",
                "description": "Get the total confirmed sales amount.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_top_selling_products",
                "description": (
                    "Get the top 10 best-selling products "
                    "based on quantity sold."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                },
            },
        },

        {
    "type": "function",
    "function": {
        "name": "get_sales_summary",
        "description": (
            "Get an overall sales summary including total confirmed "
            "sales, number of confirmed orders, total units sold, "
            "and average order value."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
},
        {
            "type": "function",
            "function": {
                "name": "get_low_stock_products",
                "description": (
                    "Get products whose inventory quantity "
                    "is at or below their reorder level."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                },
            },
        },
        {
    "type": "function",
    "function": {
        "name": "get_branch_sales",
        "description": (
            "Get total confirmed sales grouped by branch. "
            "Use this when the user asks about branch sales, "
            "top performing branches, or wants to compare branches."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
},
{
    "type": "function",
    "function": {
        "name": "get_business_insights",
        "description": (
            "Analyze the ERP business data and provide useful business insights "
            "using sales summary, branch sales, top-selling products, low-stock "
            "products, and inventory recommendations. "
            "Use this when the user asks for business insights, an overall "
            "business analysis, or what actions the business should take."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
},

{
    "type": "function",
    "function": {
        "name": "get_inventory_recommendations",
        "description": (
            "Get AI-ready inventory recommendations for products "
            "that are at or below their reorder level. "
            "Use this when the user asks what products should be reordered "
            "or which inventory items need attention."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
},

    ]

    messages = [
       {
    "role": "system",
    "content": (
        "You are an AI business assistant for a retail ERP system. "

        "Use the available tools whenever the user's question "
        "requires ERP data. "

        "Never invent ERP numbers. Only use numbers returned "
        "by the ERP tools. "

        "Use previous conversation messages when they provide "
        "important context. "

        "Format your answers clearly and professionally. "

        "When presenting multiple business metrics, use a short "
        "heading followed by bullet points. "

        "Use commas for large numbers. "

        "Format monetary values with two decimal places. "

        "For example: $3,010,500.00. "

        "Keep answers concise and easy to read. "

        "When comparing businesses, branches, products, or "
        "warehouses, use a numbered list or bullet points. "

        "After presenting the data, provide a short business "
        "insight when appropriate."
    ),
},
    ]

    # Add previous conversation history
    if history:
        messages.extend(history)

    # Add current question
    messages.append(
        {
            "role": "user",
            "content": question,
        }
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        tools=tools,
        tool_choice="auto",
    )

    message = response.choices[0].message

    # AI can answer without using an ERP tool
    if not message.tool_calls:
        return message.content

    # Add the assistant tool-call message
    messages.append(message)

    # Execute requested tools
    for tool_call in message.tool_calls:

        function_name = tool_call.function.name

        if function_name == "get_total_sales":
            result = get_total_sales()

        elif function_name == "get_sales_summary":
           result = get_sales_summary()

        elif function_name == "get_top_selling_products":
            result = get_top_selling_products()

        elif function_name == "get_low_stock_products":
            result = get_low_stock_products()

        elif function_name == "get_branch_sales":
            result = get_branch_sales()

        elif function_name == "get_inventory_recommendations":
            result = get_inventory_recommendations()

        elif function_name == "get_business_insights":
            result = get_business_insights()

        else:
            result = None

        messages.append(
            {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(
                    result,
                    default=str
                ),
            }
        )

    # Ask AI to create the final answer
    final_response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
    )

    return final_response.choices[0].message.content

