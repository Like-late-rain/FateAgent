'use client';

import { useState } from 'react';
import type { ParsedMatchInfo } from '@fateagent/shared-types';
import { parseQuery } from '@/services/analysis';

export type ParseState =
  | { status: 'idle' }
  | { status: 'parsing' }
  | { status: 'parsed'; parsed: ParsedMatchInfo }
  | { status: 'error'; message: string };

export function useParseQuery() {
  const [state, setState] = useState<ParseState>({ status: 'idle' });

  const parse = async (query: string) => {
    if (!query.trim()) {
      setState({ status: 'error', message: '请输入比赛信息' });
      return;
    }

    setState({ status: 'parsing' });
    try {
      const res = await parseQuery(query);
      if (!res.success || !res.data) {
        setState({
          status: 'error',
          message: res.error?.message ?? '解析服务异常'
        });
        return;
      }

      if (!res.data.success || !res.data.parsed) {
        setState({
          status: 'error',
          message: res.data.error ?? '无法解析比赛信息'
        });
        return;
      }

      setState({ status: 'parsed', parsed: res.data.parsed });
    } catch (error) {
      const message = error instanceof Error ? error.message : '解析异常';
      setState({ status: 'error', message });
    }
  };

  const reset = () => setState({ status: 'idle' });

  const editParsed = (parsed: ParsedMatchInfo) => {
    setState({ status: 'parsed', parsed });
  };

  return { state, parse, reset, editParsed };
}
