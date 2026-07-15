from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, code):
        pass

    def receive(self, text_data=None):
        text_data_dict = json.loads(text_data)
        message = text_data_dict['message']
        self.send(text_data=json.dumps({
            'message':message
        }))
