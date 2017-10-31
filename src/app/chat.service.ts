import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ApiAiClient} from 'api-ai-javascript';


// MESSAGE CLASS FOR DISPLAYING MESSAGES IN THE COMPONENT
export class Message {
  constructor(public content: string , public sentby: string ){}
}


@Injectable()
export class ChatService {


  readonly token = environment.dialogflow.angularBot;

  readonly  client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {
  }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {

    const userMessage = new Message(msg, 'user');

    this.update(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      });
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }


}
