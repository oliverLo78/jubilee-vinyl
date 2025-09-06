import { useMutation } from '@apollo/client';
import { CREATE_VINYL_ORDER } from '../utils/mutations';

function VinylOrderForm() {
  const [createOrder, { loading, error }] = useMutation(CREATE_VINYL_ORDER);

  const handleSubmit = async (orderData) => {
    try {
      const { data } = await createOrder({
        variables: {
          input: {
            trackId: orderData.trackId,
            trackName: orderData.trackName,
            artistName: orderData.artistName,
            vinylColor: orderData.color,
            vinylSize: orderData.size,
            price: 29.99, // Your pricing logic
            // ... other fields
          }
        }
      });
      console.log('Order created:', data.createVinylOrder);
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  };
}