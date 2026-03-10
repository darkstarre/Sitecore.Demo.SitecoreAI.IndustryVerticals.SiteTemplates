import { ComponentProps } from '@/lib/component-props';
import { ImageField, Placeholder, withDatasourceCheck } from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

const ORRICK_LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/1/19/Orrick_Herrington_%26_Sutcliffe_logo.svg';

interface Fields {
  LogoLight: ImageField;
  LogoDark: ImageField;
}

interface HeaderProps extends ComponentProps {
  fields: Fields;
}

export const DefaultHeaderExtended = (props: HeaderProps) => {
  const id = props.params.RenderingIdentifier;

  return (
    <section
      className={`bg-background dark:bg-background-dark relative py-8 ${props.params.styles}`}
      id={id ? id : undefined}
    >
      <div className="container flex items-center gap-2 lg:gap-4">
        <div className="mr-auto max-w-50">
          <Link href={'/'}>
            <Image
              src={ORRICK_LOGO_URL}
              alt="Orrick"
              width={300}
              height={169}
              className="h-auto w-full max-w-[220px]"
              priority
            />
          </Link>
        </div>
        <div className="order-last lg:order-0 lg:mr-4 xl:mr-8">
          <Placeholder
            name={`header-extended-nav-${props?.params?.DynamicPlaceholderId}`}
            rendering={props.rendering}
          />
        </div>
      </div>
    </section>
  );
};

export const Default = withDatasourceCheck()<HeaderProps>(DefaultHeaderExtended);
