import { Field, Int, ObjectType } from '@nestjs/graphql';

// Helper function to create a generic GraphQL type
export function GraphQlApiResponse<T>(TItemClass: new () => T): any {
  @ObjectType({ isAbstract: true })
  abstract class GraphQlApiResponseClass {
    @Field(() => Int, { nullable: true })
    statusCode?: number;

    @Field()
    status: string;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    error?: string;

    @Field(() => TItemClass, { nullable: true })
    data?: T;
  }

  return GraphQlApiResponseClass;
}
