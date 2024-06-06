import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { NavigationBoxProps } from '../types/navigationBox';

const NavigationBox: React.FC<NavigationBoxProps> = ({ title, route, condition = true, alertMessage }) => {
    const router = useRouter();

    const handleClick = () => {
        if (condition) {
            router.push(route);
        } else if (alertMessage) {
            alert(alertMessage);
        }
    };

    return (
        <Box mb={4}>

            {
                condition && (
                    <Button onClick={handleClick}>
                        {title}
                    </Button>
                )
            }

        </Box>
    );
};

export default NavigationBox;
