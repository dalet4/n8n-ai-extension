/* eslint-disable */
/**
 * TypeScript declaration for Vue files
 * This allows TypeScript to import .vue files
 */
declare module '*.vue' {
  // Simple declaration without Vue type dependency
  const component: any;
  export default component;
}
