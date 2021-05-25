import React, { FC } from "react";

import { Spacing } from "../constants/dimension";
import useColors from "../hooks/useColors";
import useTranslation from "../hooks/useTranslation";
import Text from "./Text";

export interface AmountMetaProps {
    amount?: string;
    suffix?: string;
    disabled?: boolean;
}

const AmountMeta: FC<AmountMetaProps> = props => {
    const t = useTranslation();
    const { textDark, textLight, placeholder, border } = useColors();
    return (
        <Text
            style={{
                fontSize: 18,
                paddingBottom: 13,
                marginBottom: 15,
                textAlign: 'right',
                color: props.disabled ? placeholder : props.amount ? textDark : textLight,
                borderBottom: `1px solid ${border}`
            }}
        >
            {props.disabled ? t("n/a") : props.amount ? props.amount + " " + (props.suffix || "") : t("n/a")}
        </Text>
    );
};

export default AmountMeta;
