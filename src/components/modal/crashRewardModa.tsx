import { addToast, Button, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from '@heroui/react';
import Sparkles from 'react-sparkle'


const CrashRewardModal = (props: any) => {

    const { summary, open, setOpen } = props

    const onClose = () => {
        setOpen(false)
    }

    const onOpenChange = (open: boolean) => {
        setOpen(open)
    }


    return (
        <Modal isOpen={open} backdrop='blur' placement={`auto`} onOpenChange={onOpenChange} size='lg' >
            <ModalContent className='relative scrollbar-hide'>
                {() => (
                    <><Sparkles flicker={false} />
                        <ModalHeader className="flex flex-col gap-1">Round #{summary.round}</ModalHeader>
                        <p className='text-white text-center text-2xl font-bold'>Winner</p>
                        <ModalBody>
                            <div className='flex flex-col items-center'>
                                <Image src={summary.winner?.avatar} alt={summary.winner?.username} className='w-40 h-40 rounded-full' />
                                <div className='flex flex-col'>
                                    <p className='text-white'>{summary.winner?.username} wins</p>
                                    <p className='text-white text-center'>{summary.payouts?.toLocaleString()}</p>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default CrashRewardModal