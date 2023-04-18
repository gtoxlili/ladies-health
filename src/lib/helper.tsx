// eslint-disable-next-line @typescript-eslint/no-empty-function
import {OperateVO} from "@lib/axios";
import Tooltip from "@mui/material/Tooltip";
import {IconButton} from "@mui/material";
import {enqueueSnackbar, SnackbarKey} from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useClient} from "@lib/hook";
import {KeyedMutator} from "swr";

export function noop() {
}

// 包含回滚操作的提示
export function callBackSnackbar<T>(operate: OperateVO, func: KeyedMutator<T>) {
    const action = (snackbarId: SnackbarKey) => {
        const client = useClient();

        return (
            <Tooltip title="回滚行为">
                <IconButton size="small" onClick={async () => {
                    const res = await client.rollbackDao(operate.rollbackUrl);
                    if (res.data.code !== 200) {
                        enqueueSnackbar(`回滚失败: ${res.data.message}`, {variant: 'warning'})
                    } else {
                        enqueueSnackbar(`已回滚 ${operate.action} 行为`, {variant: 'info'})
                        func()
                    }
                }}>
                    <ArrowBackIcon sx={{
                        color: 'white',
                    }}/>
                </IconButton>
            </Tooltip>
        )
    };
    enqueueSnackbar(`${operate.action} 修改成功`, {variant: 'success', action, autoHideDuration: 5000})
}
