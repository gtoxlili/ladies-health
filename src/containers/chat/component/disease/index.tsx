import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import {useDiseasesService} from "@service/inquiry";


const RelatedDisease = (
    props: {
        topicId?: string
    }
) => {
    const topicId = props.topicId
    const [diseases] = useDiseasesService(topicId)

    return !topicId ? <></> :
        <div className='bg-neutral-50/60 shadow-md rounded-md py-6 px-4 space-y-2 h-full overflow-y-auto'>
            <div className="text-xl font-medium text-rose-800 mb-6">可能与问询相关的疾病</div>
            {
                diseases.map((disease, index) => {
                    return <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography>{disease.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography
                                variant='caption'
                                sx={{
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {disease.detail}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                })
            }
        </div>

}

export default RelatedDisease
