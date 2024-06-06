import { Flex, Spinner as ChakraSpinner } from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
    return (
        <Flex
            alignItems='center'
            justifyContent='center'
            minHeight='100vh'
        >
            <ChakraSpinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
        </Flex>
    );
}

export default LoadingSpinner;
