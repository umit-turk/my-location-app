import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface NavigationBoxProps {
  title: string;
  route: string;
  condition?: boolean;
  alertMessage?: string;
}

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
      <Button onClick={handleClick}>
        {title}
      </Button>
    </Box>
  );
};

export default NavigationBox;
