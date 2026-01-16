import { client } from './shopify';

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export async function login(email: string, password: string): Promise<{ accessToken: string; expiresAt: string }> {
    const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

    const { data } = await client.request(query, {
        variables: { input: { email, password } }
    });

    if (data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
        throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
    }

    return data.customerAccessTokenCreate.customerAccessToken;
}

export async function register(email: string, password: string, firstName: string, lastName: string): Promise<void> {
    const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

    const { data } = await client.request(query, {
        variables: { input: { email, password, firstName, lastName } }
    });

    if (data?.customerCreate?.customerUserErrors?.length > 0) {
        throw new Error(data.customerCreate.customerUserErrors[0].message);
    }
}

export async function getCustomer(accessToken: string): Promise<Customer> {
    const query = `
    query getCustomer($accessToken: String!) {
      customer(customerAccessToken: $accessToken) {
        id
        firstName
        lastName
        email
      }
    }
  `;

    const { data } = await client.request(query, { variables: { accessToken } });

    if (!data?.customer) {
        throw new Error("Invalid access token");
    }

    return data.customer;
}

export async function logout(accessToken: string): Promise<void> {
    const query = `
      mutation customerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
          deletedAccessToken
          userErrors {
            message
          }
        }
      }
    `;

    await client.request(query, { variables: { customerAccessToken: accessToken } });
}
