'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const getNum = (param: string | null, defaultValue: number): number => {
  if (!param) return defaultValue;
  const parsed = parseInt(param);
  return isNaN(parsed) ? defaultValue : parsed;
};

const useCustomMove = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = getNum(searchParams.get('page'), 1);
  const size = getNum(searchParams.get('size'), 10);

  const queryDefault = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    return params.toString();
  }, [page, size]);

  const moveToList = (pageParam?: { page?: number; size?: number }) => {
    let queryStr: string;

    if (pageParam) {
      const pageNum = pageParam.page ?? page;
      const sizeNum = pageParam.size ?? size;
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('size', sizeNum.toString());
      queryStr = params.toString();
    } else {
      queryStr = queryDefault;
    }

    console.log("router.pathname=>" + pathname);
    console.log("queryStr=>" + queryStr);

    router.push(`${pathname}?${queryStr}`);
  };

  const moveToModify = (num: number) => {
    console.log(queryDefault);
    router.push(`/modify/${num}?${queryDefault}`);
  };

  const moveToRead = (num: number) => {
    console.log(queryDefault);
    router.push(`/read/${num}?${queryDefault}`);
  };

  const moveToRefresh = () => {
    router.refresh();
  }

  return { moveToList, moveToModify, moveToRead, moveToRefresh, page, size };
};

export default useCustomMove;
