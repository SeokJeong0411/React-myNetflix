import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      darker: string;
      default: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
  }
}
