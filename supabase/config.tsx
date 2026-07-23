import { createClient } from '@supabase/supabase-js'

// URL y clave pública de tu proyecto Supabase
const supabaseUrl = 'https://ptjlzrbznhntkwhksese.supabase.co'
const supabaseKey = 'sb_publishable_SMR6AWg-6kr2TGxy71ywjw_SUFFV8mA'

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)
