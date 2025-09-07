import { useMutation } from '@apollo/client';
import { CREATE_VINYL_ORDER } from '../utils/mutations';

const VinylOrder = () => { 
// function VinylOrderForm() {
  const [createOrder, { loading, error }] = useMutation(CREATE_VINYL_ORDER);

  // const handleSubmit = async (orderData) => {
    try {
      const { data } = createOrder({
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

   return <div>Vinyl Order Page</div>;

export default VinylOrder;