from locust import HttpUser,task,between
import random

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)

    @task(5)
    def random_products(self):
        self.client.get(
            "/products/random/",
            name="/products/random/"
        )

    @task(4)
    def filtering_products(self):
        self.client.get(
            "/product/filtering/",
            name="/product/filtering/"
        )

    @task(4)
    def product_list(self):
        product_id = random.randint(1, 50)

        self.client.get(
            f"/product/list/{product_id}",
            name="/product/list/[id]"
        )

    @task(6)
    def product_detail(self):
        product_id = random.randint(1, 50)

        self.client.get(
            f"/product/detail/{product_id}",
            name="/product/detail/[id]"
        )

    @task(3)
    def store_list(self):
        self.client.get(
            "/store/list",
            name="/store/list"
        )

    @task(3)
    def store_detail(self):
        store_id = random.randint(1, 20)

        self.client.get(
            f"/store/detail/{store_id}",
            name="/store/detail/[id]"
        )