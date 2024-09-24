import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { useTheme } from '@mui/material/styles';
import { useSnackbarController } from 'firecms';
import LinearProgress from '@mui/material/LinearProgress';
import { SubscriptionItem } from '../molecules/SubscriptionItem';
import { PaymentItem } from '../molecules/PaymentItem';
import { Stack } from '@mui/system';

interface SubscriptionPaymentsModalProps {
    subscription: SubscriptionItem;
    payments: PaymentItem[];
    client: {name: string, email: string, phone: string};
    isOpen: boolean;
    closeFn: any;
}

const SubscriptionPaymentsModal: React.FC<SubscriptionPaymentsModalProps> = ({
    subscription = undefined,
    payments = [],
    client,
    isOpen = false,
    closeFn = () => { }
}) => {
    const theme = useTheme();
    const [dueDate, setDueDate] = useState(moment().toISOString());
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const snackbarController = useSnackbarController();

    const handleDateChange = (value: Moment | null) => {
        if (value) setDueDate(value.toISOString());
    }

    return (
        <React.Fragment>
            <Dialog
                maxWidth={'lg'}
                fullWidth={true}
                open={isOpen}
                onClose={closeFn}
                PaperProps={{}}
                scroll={'paper'}
            >
                <DialogTitle>{subscription?.description} - Cobranças</DialogTitle>
                <DialogContent>
                    {payments && payments.length > 0 && (
                        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                            {payments.map((item: PaymentItem, index: number) => (
                                <PaymentItem
                                    key={`payment-${index}`}
                                    theme={theme}
                                    payment={item}
                                    client={client}
                                />
                            ))}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: theme.palette.grey[600] }} onClick={closeFn} disabled={loading}>
                        Fechar
                    </Button>
                </DialogActions>
                {loading && (
                    <LinearProgress variant="determinate" value={loadingProgress} sx={{ height: '0.5rem' }} />
                )}
            </Dialog>
        </React.Fragment>
    );
}

export default SubscriptionPaymentsModal;