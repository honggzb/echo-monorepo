
import WidgetFooter from '../components/widget-footer';
import { WidgetHeader } from '../components/widget-header';
import WidgetAuthScreen from '../screens/widget-auth-screen';

interface Props {
  organizationId: string;
}

const WidgetView = ({organizationId}: Props) => {
  return (
    <main className='min-h-screen min-w-screen flex flex-col h-full w-full overflow-hidden rounded-xl border bg-muted'>
      <WidgetAuthScreen />
      <WidgetFooter />
    </main>
  )
}

export default WidgetView