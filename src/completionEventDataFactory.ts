import { CreateCompletionRequest, CreateCompletionResponse } from 'openai';
import { EventData } from './eventTypes';
import { EventAttributesBuilder } from './eventAttributesBuilder';

export interface ChatCompletionEventDataFactoryOptions {
  request: CreateCompletionRequest;
  response: CreateCompletionResponse;
  responseTime: number;
  applicationName: string;
}

export const createCompletionEventDataFactory = () => {
  const createEventData = ({
    request,
    response,
    applicationName,
    responseTime: response_time,
  }: ChatCompletionEventDataFactoryOptions): EventData => {
    const attributes = new EventAttributesBuilder({
      initialAttributes: { response_time, applicationName },
      specialTreatments: {
        messages: {
          parseValue: (value) => JSON.stringify(value),
        },
      },
    })
      .addObjectAttributes(request)
      .addObjectAttributes(response)
      .getAttributes();

    return { eventType: 'LlmCompletion', attributes };
  };

  return {
    createEventData,
  };
};
