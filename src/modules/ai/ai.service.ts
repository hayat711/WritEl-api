import {Injectable} from '@nestjs/common';
import {Configuration, CreateCompletionRequest, OpenAIApi,} from "openai";
import {ConfigService} from "@nestjs/config";
import axios from "axios";

const DEFAULT_MODEL_ID ="text-davinci-003"
const DEFAULT_TEMPRETURE=0.8

@Injectable()
export class AiService {
  private readonly openAiApi:OpenAIApi;

  constructor(
      private readonly configService: ConfigService,
  ) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  async teachMe(prompt:string, temperature?:number) {
    console.log('requested prompt ->', prompt);
    try {
      return await this.generateResponse(prompt, temperature);
    } catch (e) {
      console.log('failed to get response from openAI', e.messages);
      console.log(e.stack);
    }
  }

  public async rephrase(prompt: string, temperature?:number) {
    try{
      return await this.generateResponse(prompt, temperature);
    }catch (e) {
      console.log('failed to get response from openAI', e.messages);
      console.log(e.stack);
    }
  }

  public async correctIt(prompt: string, temperature?:number) {
    try {
      return await this.generateResponse(prompt, temperature);
    } catch (e) {
      console.log('failed to get response from openAI', e.messages);
      console.log(e.stack);
    }
  }

  public async similarGrammars(prompt: string, temperature?: number) {
    try {
      return await this.generateResponse(prompt, temperature);
    } catch (e) {
      console.log('failed to get response from openAI', e.messages);
      console.log(e.stack);
    }
  }

  public async explainMe(prompt: string, temperature?: number) {
    try {
      return await this.generateResponse(prompt, temperature);
    } catch (e) {
      console.log('failed to get response  from openAI', e.message());
      console.log(e.stack);
    }
  }

  public async paraphrase(prompt: string, temperature?: number) {
    try {
      const options = {
        method: 'POST',
        url: 'https://paraphrasing-and-rewriter-api.p.rapidapi.com/rewrite-light',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '4f9474b1a7mshf38073a9865f671p18ff4fjsn5eb377d5ca0d',
          'X-RapidAPI-Host': 'paraphrasing-and-rewriter-api.p.rapidapi.com',
        },
        data: {
          from: 'en',
          text: prompt,
        },
      };

      const response = await axios.request(options);
      const paraphrasedText = response.data;

      return paraphrasedText;
    } catch (error) {
      console.log(error.message);
      console.log(error.response?.data);
      console.log(error.response?.status);
      console.log(error.response?.headers);
      throw new Error('Paraphrasing request failed');
    }
  }

  public async aiComplete(prompt: string, temperature?: number) {
    const url = 'https://openai80.p.rapidapi.com/completions';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '4f9474b1a7mshf38073a9865f671p18ff4fjsn5eb377d5ca0d',
        'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
      },
      body: {
        model: 'text-davinci-003',
        prompt: 'Say this is a test',
        max_tokens: 7,
        temperature: 0,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
        stop: ''
      }
    };

    try {
      //@ts-ignore
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  // method to get response form OPENAI
  private async generateResponse(prompt: string, temperature?: number) {
    try{
      const params: CreateCompletionRequest = {
        prompt: prompt,
        model: DEFAULT_MODEL_ID,
        temperature: temperature !== undefined ? temperature : DEFAULT_TEMPRETURE,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      };

      const response = await this.openAiApi.createCompletion(params);

      const { data } = response;
      if (data?.choices.length) {
        console.log('response from AI ', data.choices);
        return data.choices;
      }
      return response.data;
    } catch (e) {
      if (e ) {
        // Handle specific exception from OpenAI API
        console.log('Failed to get response from OpenAI:', e.message);
      } else {
        // Handle other types of exceptions
        console.log('An error occurred:', e.message);
      }
      console.log('Stack trace:', e.stack);
    }
  }
}
