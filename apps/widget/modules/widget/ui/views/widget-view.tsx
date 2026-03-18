"use client";

import { useAtomValue } from 'jotai';
import WidgetFooter from '../components/widget-footer';
import WidgetAuthScreen from '../screens/widget-auth-screen';
import { screenAtom } from '../atoms/widget-atoms';
import WidgetErrorScreen from '../screens/widget-error-screen';
import WidgetLoadingScreen from './widget-loading-screen';

interface Props {
  organizationId: string | null;
}

const WidgetView = ({organizationId}: Props) => {

  const screen = useAtomValue(screenAtom);
  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: voice</p>,
    inbox: <p>TODO: inbox</p>,
    selection: <p>TODO: selection</p>,
    chat: <p>TODO: chat</p>,
    contact: <p>TODO: contact</p>,
  }
  return (
    <main className='min-h-screen min-w-screen flex flex-col h-full w-full overflow-hidden rounded-xl border bg-muted'>
      {screenComponents[screen]}
      <WidgetFooter />
    </main>
  )
}

export default WidgetView