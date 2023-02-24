import ButtonFavAndCart from '@/components/form/ButtonFavAndCart';
import Title from '@/components/text/Title';
import { IStoreItem } from '@/types/types';
import priceFormater from '@/utils/priceFormater';
import useGetUpdatedData from '@/custom-hooks/useGetUpdatedData';
import Image from 'next/image';
import styled from 'styled-components';

export const getStaticPaths = async () => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL + '/api/get/getItemsId',
      {
        method: 'GET',
      }
    );
    if (res.status === 200) {
      const json = await res.json();
      const paths = json?.itensId?.map((itemId: any) => ({
        params: { itemId: itemId.toString() },
      }));
      return {
        paths: paths,
        fallback: false,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps = async (context: any) => {
  try {
    const itemId: string = context.params.itemId;
    const res = await fetch(
      process.env.NEXT_PUBLIC_URL + '/api/post/getItemById',
      {
        method: 'POST',
        body: itemId,
      }
    );
    if (res.status === 200) {
      const storeItem = await res.json();
      return {
        props: { storeItem },
      };
    }
  } catch (err) {
    console.log(err);
  }
};

type Props = { storeItem: { item: IStoreItem } };

const ItemPage = ({ storeItem }: Props) => {
  const { productImg, productTitle, estoque, numDeCompras, productPrice, _id } =
    storeItem.item;

  const { data, error, isLoading } = useGetUpdatedData(_id);

  return (
    <ItemContainer>
      <Title>{productTitle}</Title>
      <FlexWithGap>
        <Image
          style={{ borderRadius: '5px' }}
          src={productImg}
          width='540'
          height='540'
          alt=''
        />
        <FlexWithGap direction='column'>
          <p>
            Disponíveis no estoque:{' '}
            <strong>{data ? data.estoque : estoque}</strong>
          </p>
          <p>
            Comprado <strong>{data ? data.numDeCompras : numDeCompras}</strong>{' '}
            vezes.
          </p>
          <h2>
            {data
              ? priceFormater(data.productPrice)
              : priceFormater(productPrice)}
          </h2>
          <FlexWithGap style={{ display: 'flex', gap: '1rem' }}>
            <ButtonFavAndCart>Colocar no carrinho</ButtonFavAndCart>
            <ButtonFavAndCart>Comprar</ButtonFavAndCart>
          </FlexWithGap>
        </FlexWithGap>
        <DetailsContainer direction='column'>
          <strong>Detalhes:</strong>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque a interdum nunc, at laoreet lacus. Cras vitae velit
            sapien. Sed ornare congue sapien hendrerit vehicula. Nam sodales
            purus tellus, ac pretium metus porttitor vitae. Aenean viverra
            fringilla pharetra. Pellentesque nec malesuada mauris. Mauris
            eleifend quam vel ultrices tristique.
          </p>
          <strong>Características:</strong>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque a interdum nunc, at laoreet lacus. Cras vitae velit
            sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. .
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque a interdum nunc, at laoreet lacus. Cras. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Pellentesque a interdum
            nunc, at laoreet lacus. Cras vitae velit sapien.
          </p>
        </DetailsContainer>
      </FlexWithGap>
    </ItemContainer>
  );
};

export default ItemPage;

const ItemContainer = styled.div`
  width: 90%;
  margin: 1rem auto;
  border: 1px solid white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FlexWithGap = styled.div<{ gap?: number; direction?: string }>`
  display: flex;
  gap: ${({ gap = 1 }) => gap}rem;
  flex-direction: ${({ direction = 'row' }) => direction};
`;

const DetailsContainer = styled(FlexWithGap)`
  max-width: 500px;
`;
