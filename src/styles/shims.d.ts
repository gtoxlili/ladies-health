// declare module "react" {
//
//     interface CSSProperties {
//         // 自定义属性
//         '--hover-bg-color'?: string
//     }
//
// }

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
