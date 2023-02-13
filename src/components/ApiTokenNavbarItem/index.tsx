import { Button } from '@deriv/ui';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import useApiToken from '@site/src/hooks/useApiToken';
import useAuthContext from '@site/src/hooks/useAuthContext';
import { TTokenType } from '@site/src/types';
import React, { useCallback } from 'react';
import styles from './api_token_switcher.module.scss';

const ApiTokenNavbarItem = () => {
  const { is_logged_in, is_authorized } = useAuthContext();
  const { tokens, currentToken, updateCurrentToken, isLoadingTokens } = useApiToken();

  const onSelectItem = useCallback(
    (token: TTokenType) => {
      updateCurrentToken(token);
    },
    [updateCurrentToken],
  );

  if (!is_logged_in || !is_authorized || isLoadingTokens) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='navbar__item navbar__link' asChild>
        <Button type='button' color={'tertiary'}>
          {currentToken ? `Selected Token: ${currentToken.display_name}` : 'Please create a token'}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.DropdownMenuContent}
          sideOffset={20}
          alignOffset={-50}
          align={'end'}
        >
          {tokens.map((tokenItem) => (
            <DropdownMenu.Item
              key={tokenItem.token}
              className={styles.DropdownMenuItem}
              onSelect={() => {
                onSelectItem(tokenItem);
              }}
            >
              {`${tokenItem.display_name}`}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Arrow className={styles.DropdownMenuArrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ApiTokenNavbarItem;