export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state, //...state is a spread operator that copies the state
        connection: action.connection, //action.connection is the connection from the loadProvider function
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "ETHER_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };

    default:
      return state;
  }
};

const DEFAULT_TOKENS_STATE = {
  loaded: false,
  contracts: [],
  symbols: [],
};

export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {
  switch (action.type) {
    case "TOKEN_1_LOADED":
      return {
        ...state,
        loaded: true,
        contracts: [action.token],
        symbols: [action.symbol],
      };
    case "TOKEN_1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };

    case "TOKEN_2_LOADED":
      return {
        ...state,
        loaded: true,
        /*contracts is an array of contracts and
         ...state.contracts is a spread operator that copies the contracts array
         action.token is the token from the loadToken function */
        contracts: [...state.contracts, action.token],
        symbols: [...state.symbols, action.symbol],
      };

    case "TOKEN_2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };

    default:
      return state;
  }
};

const DEFAULT_EXCHANGE_STATE = {
  loaded: false,
  contract: {},
  transaction: {
    isSuccessful: false,
  },
  allOrders:{
    loaded:false,
    data : []
  },
  events: [],
};

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
  let index, data;
  switch (action.type) {
    case "EXCHANGE_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.exchange,
      };

    //-------------------------------------------------------------------------------
    // ORDER BOOK CASES
    case "ALL_ORDERS_LOADED":
      return {
        ...state,
        allOrders: {
          loaded: true,
          data: action.allOrders,
        }
      };

    // ------------------------------------------------------------------------------
    // BALANCE CASES
    case "EXCHANGE_TOKEN_1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };
    case "EXCHANGE_TOKEN_2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };

    // ------------------------------------------------------------------------------
    // TRANSFER CASES (DEPOSIT & WITHDRAWS)
    case "TRANSFER_REQUEST":
      return {
        ...state,
        trasnsaction: {
          transactionType: "Transfer",
          isPending: true,
          isSuccessful: false,
        },
        transferInProgress: true,
      };
    case "TRANSFER_SUCCESS":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: true,
        },
        transferInProgress: false,
        events: [action.event, ...state.events],
      };
    case "TRANSFER_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "Transfer",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
        transferInProgress: false,
      };
    //-------------------------------------------------------------------------------------
    // ORDER CASES
    case "NEW_ORDER_REQUEST":
      return {
        ...state,
        trasnsaction: {
          transactionType: "New Order",
          isPending: true,
          isSuccessful: false,
        },
      };
    
    case "NEW_ORDER_SUCCESS":
      //prevent duplicate orders
      index = state.allOrders.data.findIndex(order => order.id === action.orderId)


      if (index === -1) {
        data = [...state.allOrders.data, action.order]//agr duplicate order nhi hai toh data ko update kro aur return kro
      }else{
        data = state.allOrders.data//agr duplicate order hai toh data ko wahi rehne do update na kro aur return kro
      }


      return {
        ...state,
        allOrders: {
          ...state.allOrders,
          data:[...state.allOrders.data, action.order]
        },
        transaction: {
          transactionType: "New Order",
          isPending: false,
          isSuccessful: true,
        },
        events: [action.event, ...state.events],
      };

    case "NEW_ORDER_FAIL":
      return {
        ...state,
        transaction: {
          transactionType: "New Order",
          isPending: false,
          isSuccessful: false,
          isError: true,
        },
      }

    default:
      return state;
  }
};

// export const provider = (state = {}, action) => {
//   switch (action.type) {
//     case "PROVIDER_LOADED":
//       return {
//         ...state, //...state is a spread operator that copies the state
//         connection: action.connection, //action.connection is the connection from the loadProvider function
//       };
//     case "NETWORK_LOADED":
//       return {
//         ...state,
//         chainId: action.chainId,
//       };
//     case "ACCOUNT_LOADED":
//       return {
//         ...state,
//         account: action.account,
//       };
//     case "BALANCE_LOADED":
//       return {
//         ...state,
//         balance: action.balance,
//       };

//     default:
//       return state;
//   }
// }

// const DEFAULT_TOKENS_STATE = { loaded: false, contracts: [], symbols:[] }
// export const tokens = (state = DEFAULT_TOKENS_STATE, action) => {
//   switch (action.type) {
//     case "TOKEN_1_LOADED":
//       return {
//         ...state,
//         loaded: true,
//         contracts: [action.token],
//         symbols: [action.symbol],
//       };

//     case "TOKEN_2_LOADED":
//       return {
//         ...state,
//         loaded: true,
//         /*contracts is an array of contracts and
//         ...state.contracts is a spread operator that copies the contracts array
//         action.token is the token from the loadToken function */
//         contracts: [...state.contracts, action.token],
//         symbols: [...state.symbols, action.symbol],
//       };

//     //-----------------//
//     // Used for balance cases
//     //-----------------//

//     case "TOKEN_1_BALANCE_LOADED":
//       return {
//         ...state,
//         balances: [action.balance],
//       };

//     case "TOKEN_2_BALANCE_LOADED":
//       return {
//         ...state,
//         balances: [...state.balances , action.balance],
//       };
//     default:
//       return state;
//   }
// }

// export const exchange = (
//   state = { loaded: false, contracts: []},
//   action
// ) => {
//   switch (action.type) {
//     case "EXCHANGE_LOADED":
//       return {
//         ...state,
//         loaded: true,
//         contract: action.exchange,
//       };

//     //-----------------//
//     // Used for balance cases
//     //-----------------//

//     case "EXCHANGE_TOKEN_1_BALANCE_LOADED":
//       return {
//         ...state,
//         balances: [action.balance],
//       };

//     case "EXCHANGE_TOKEN_2_BALANCE_LOADED":
//       return {
//         ...state,
//         balances: [...state.balances , action.balance],
//       };

//     default:
//       return state;
//   }
// };