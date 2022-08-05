from uuid import uuid4
from app.models import BoxModel

alpha_keys = [
    "3ed2a900d96970836833f6b3f8ebd54bf876a142cf453087",
    "af35fb4d63dc405a264ee734e89ce6d284114e581a2f08de",
    "a62ec1592f30413b36d1a4bf2765bbb521fc857a79952ec7",
    "a80b8f9b60d045327c020f1dfe10e20ee69498389f611dcc",
    "fdfa197fca9bef13d0abb2827c03804ede5661d3439819c5",
    "42b9be8bbf3925d069a5640f740045b3a6f5c98065bf792e",
    "309cbb39b909a6282cead2a905dfee2091317e4a10b4603d",
    "6f1acc16ead1f2dfea4efbe9d3a123d5bec28f702d96719b",
    "abc6a0724f51ec554cbd32d63fd039b319d037c324aab009"
]

def create_box(key):
    box = BoxModel(
        pub_id=uuid4().hex,
        key=key
    )
    box.save()
    print(f'{box.key} -> {box.pub_id}')

for k in alpha_keys:
    create_box(k)