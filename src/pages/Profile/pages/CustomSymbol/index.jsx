import { components } from 'react-select';
const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
   <svg style={{margin: '0 5px  0 0'}} width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="arrow sort">
<path id="Combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M7.39141 8.94194L9.89141 11.4419C10.1355 11.686 10.5312 11.686 10.7753 11.4419L13.2753 8.94194C13.5194 8.69786 13.5194 8.30214 13.2753 8.05806C13.0312 7.81398 12.6355 7.81398 12.3914 8.05806L10.9584 9.49112V1C10.9584 0.654822 10.6785 0.375 10.3334 0.375C9.98818 0.375 9.70835 0.654822 9.70835 1L9.70835 9.49112L8.2753 8.05806C8.03122 7.81398 7.63549 7.81398 7.39141 8.05806C7.14733 8.30214 7.14733 8.69786 7.39141 8.94194ZM4.10863 0.558059C3.86455 0.313981 3.46882 0.313981 3.22475 0.558059L0.724745 3.05806C0.480668 3.30214 0.480668 3.69786 0.724745 3.94194C0.968823 4.18602 1.36455 4.18602 1.60863 3.94194L3.04169 2.50888V11C3.04169 11.3452 3.32151 11.625 3.66669 11.625C4.01186 11.625 4.29169 11.3452 4.29169 11V2.50888L5.72475 3.94194C5.96882 4.18602 6.36455 4.18602 6.60863 3.94194C6.85271 3.69786 6.85271 3.30214 6.60863 3.05806L4.10863 0.558059Z" fill="var(--textColor)"/>
</g>
</svg>

    {props.data.label}
  </components.SingleValue>
  );

export default CustomSingleValue;