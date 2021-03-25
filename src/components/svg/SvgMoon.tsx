import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function SvgMoon(props: SvgProps) {
    return (
        <Svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            strokeLinejoin="round"
            strokeMiterlimit={2}
            {...props}>
            <Path d="M9.999 19.9995C13.8252 20.0397 17.3202 17.835 18.9319 14.3647C17.9176 14.8073 16.8191 15.024 15.7127 15C11.3758 14.9951 7.86124 11.4805 7.85636 7.1436C7.89978 4.21002 9.51844 1.52665 12.093 0.119672C11.3987 0.0312668 10.6989 -0.00831498 9.999 0.00144968C4.47657 0.00144968 0 4.47819 0 10.0005C0 15.5229 4.47657 19.9995 9.999 19.9995Z" fill="white"/>
        </Svg>
    );
}

export default SvgMoon;