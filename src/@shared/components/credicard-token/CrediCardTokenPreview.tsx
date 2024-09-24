import React, { useEffect, useState } from "react";
import * as creditCardBrands from '../../credit-cards-brands.json';

import './CreditCardTokenPreview.css'
import { Paper, Skeleton, Typography } from "@mui/material";

interface CreditCardTokenPreviewProps {
    brand?: string;
    number?: string;
}

export const CreditCardTokenPreview: React.FC<CreditCardTokenPreviewProps> = ({
    brand,
    number
}) => {
    const [showBrandLogo, setShowBrandLogo] = useState(false);

    const brands:any = creditCardBrands;
    
    useEffect(() => {
        if(brands[`${brand}`]){
            setShowBrandLogo(true);
        }
    }, [])
    
    return (
        <>
            {brand && number && (
                <Paper className="card" elevation={1} >
                    {showBrandLogo && (
                        <img className="card-brand-logo" src={brands[`${brand}`].image} />
                    )}
                    {!showBrandLogo && (
                        <Typography variant="button" display="block" gutterBottom>
                        {brand}
                        </Typography>
                    )}
                    <Typography variant="button" display="block" gutterBottom>
                        **** {number}
                    </Typography>
                </Paper>
            )}
            {!number && !brand && (
                <Skeleton variant="rectangular" animation={false} sx={{ width: '10%' }} height={'0.5rem'} />
            )}
        </>
    )
}