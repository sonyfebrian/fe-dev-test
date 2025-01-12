export interface ISearchBarProps {
    onSearch: (term: string) => void
  }
  
  
  export interface ITreeNodeProps {
    data: any
    searchTerm: string
    level?: number
  }
  export interface IUserGroupProps {
    firstName: string
    users: IUsers[]
    searchTerm: string
  }

  export interface ITransferListProps {
    leftItems: IUsers[]
    rightItems: IUsers[]
    onTransfer: (from: 'left' | 'right', to: 'left' | 'right', items: IUsers[]) => void
  }

  export interface IUsers {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: any
  }
  
  export interface IAutocompleteProps {
    placeholder?: string;
    onSelect: (user: IUsers) => void;
  }
  