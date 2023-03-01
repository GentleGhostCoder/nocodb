import catchError from '../helpers/catchError';
import { Router } from 'express';

export async function envGet(_, res) {
  res.set({
    'Content-Type': 'application/json',
  });
  res.send(
    JSON.stringify({
      PROJECTS_TITLE: process.env.PROJECTS_TITLE,
      LOGO_URL: process.env.LOGO_URL,
      LOGO_TEXT: process.env.LOGO_TEXT,
      LOGO_WIDTH: process.env.LOGO_WIDTH,
      ICON_URL: process.env.ICON_URL,
      ICON_TEXT: process.env.ICON_TEXT,
      ICON_WIDTH: process.env.ICON_WIDTH,
    })
  );
}

const router = Router();
router.get('/api/v1/db/meta/env', catchError(envGet));
export default router;
