import React from 'react';
import '@testing-library/jest-dom';
import ApiExplorerFeatures from '..';
import userEvent from '@testing-library/user-event';
import useAuthContext from '@site/src/hooks/useAuthContext';
import useWS from '@site/src/hooks/useWs';
import { render, screen } from '@testing-library/react';
import { IAuthContext } from '@site/src/contexts/auth/auth.context';
import { act } from 'react-dom/test-utils';

jest.mock('@docusaurus/router', () => ({
  useLocation: () => ({
    pathname: '/api-explorer',
    hash: '',
  }),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@site/src/hooks/useAuthContext');

const mockUseAuthContext = useAuthContext as jest.MockedFunction<() => Partial<IAuthContext>>;

describe('ApiExplorerFeatures', () => {
  beforeEach(() => {
    mockUseAuthContext.mockImplementation(() => {
      return {
        is_logged_in: true,
      };
    });
    render(<ApiExplorerFeatures />);
  });
  it('should render the title', () => {
    const title = screen.getByRole('heading', { name: /API Explorer/i });
    expect(title).toBeInTheDocument();
  });

  it('should be able to select from dropdown', async () => {
    const playground_select = await screen.findByText(/select api call/i);
    await userEvent.click(playground_select);

    const select_option = await screen.findByText(/active symbols/i);
    await userEvent.click(select_option);

    expect(select_option).not.toBeVisible();
  });

  it('should close the dropdown when clicking outside of it', async () => {
    const playground_select = await screen.findByText(/select api call/i);
    await userEvent.click(playground_select);

    const select_option = await screen.findByText(/active symbols/i);
    expect(select_option).toBeVisible();

    const page_title = await screen.findByText(/api explorer/i);
    await userEvent.click(page_title);

    expect(select_option).not.toBeVisible();
  });

  // it('should be able to close the modal', async () => {
  //   const modal = await screen.findByText(/Authorization Required/i);
  //   expect(modal).toBeVisible();

  //   const close_button = await screen.findByTestId('close-button');

  //   await userEvent.click(close_button);

  //   expect(modal).not.toBeVisible();
  // })

  it('should render the textarea', () => {
    const textarea = screen.getByPlaceholderText('Request JSON');
    expect(textarea).toBeInTheDocument();
  });

  it('should render schemawrapper', async () => {
    const playground_select = await screen.findByText(/select api call/i);
    await userEvent.click(playground_select);

    act(async () => {
      const select_option = await screen.findByText(/active symbols/i);
      await userEvent.click(select_option);

      const schemawrapper = screen.getByTestId('playgroundDocs');
      expect(schemawrapper).toBeInTheDocument();
    });
  });
});
